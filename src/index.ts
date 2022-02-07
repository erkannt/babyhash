import { sha256 } from 'js-sha256';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import { namesWithIncidence } from '../data/names-with-incidence';

const chunkString = (size: number) => (input: string) => {
  const inputLenght = input.length;
  const nChunks = Math.ceil(inputLenght / size);
  let chunks = [];
  for (let i = 0; i < nChunks; i++) {
    chunks.push(input.slice(size * i, size * i + size));
  }

  return chunks;
};

const names = pipe(
  namesWithIncidence,
  RA.map(([name]) => name),
);

const hash = (bits: number, nameCount: number) => (input: string) =>
  pipe(
    input,
    sha256.hex,
    (hex) => '0x' + hex,
    BigInt,
    (bi) => bi.toString(2),
    (tooLong) => tooLong.slice(0, bits),
    chunkString(bits / nameCount),
    RA.map((s) => parseInt(s, 2)),
    RA.map((i) => names[i]),
    (names) => names.join(' '),
  );

const updateResult = (result: HTMLElement, input: HTMLInputElement) => () => {
  result.textContent = hash(100, 10)(input.value);
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

pipe(
  {
    input: O.fromNullable(document.getElementById('input') as HTMLInputElement),
    button: O.fromNullable(document.getElementById('update')),
    result: O.fromNullable(document.getElementById('result')),
    query: O.some(urlParams.get('input') ?? ''),
  },
  sequenceS(O.Apply),
  O.match(
    () => {},
    ({ input, button, result, query }) => {
      query === '' ? (input.value = 'Adam, Steve and Eve') : (input.value = query);
      updateResult(result, input)();
      button.addEventListener('click', updateResult(result, input));
      input.addEventListener('keyup', () => history.replaceState(null, '', `?input=${input.value}`));
    },
  ),
);
