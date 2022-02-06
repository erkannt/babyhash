import {sha512} from 'js-sha512'
import {pipe} from 'fp-ts/function'
import * as O from 'fp-ts/Option';
import { sequenceS } from 'fp-ts/lib/Apply';
import { top1000 } from './names';
import * as RA from 'fp-ts/ReadonlyArray';

const chunkString =  (size: number) => (input: string) =>{
  const inputLenght = input.length
  const nChunks = Math.ceil(inputLenght / size);
  let result = []
  for (let i = 0; i < nChunks; i++) {
    result.push(input.slice(size*i, size*i+size))
  }
  return(result.map((s) => parseInt(s, 10)))
}

const hash = (input: string) => pipe(
  input,
  sha512.hex,
  (hex) => '0x' + hex,
  BigInt,
  String,
  chunkString(3),
  RA.map((i) => top1000[i]),
  (names) => names.join(' ')
)

const updateResult = (result: HTMLElement, input: HTMLInputElement) => () => {
  result.textContent = hash(input.value)
}

pipe(
  {
    input:  O.fromNullable(document.getElementById('input') as HTMLInputElement),
    button:  O.fromNullable(document.getElementById('update')),
    result:  O.fromNullable(document.getElementById('result')),
  },
  sequenceS(O.Apply),
  O.match(
    () => {},
    ({input, button, result}) => {
      updateResult(result, input)()
      button.addEventListener('click', updateResult(result, input))
    }
  )
)

