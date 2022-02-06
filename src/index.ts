import {sha512} from 'js-sha512'
import {pipe} from 'fp-ts/function'
import * as O from 'fp-ts/Option';
import { sequenceS } from 'fp-ts/lib/Apply';

const updateResult = (result: HTMLElement, input: HTMLInputElement) => () => {
  result.textContent = sha512.hex(input.value)
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
      result.textContent = sha512.hex(input.value)
      button.addEventListener('click', updateResult(result, input))
    }
  )
)

