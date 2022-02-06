import {sha512} from 'js-sha512'

export function updateResult() {
  resultElement.textContent = sha512.hex(inputElement.value)
}

const inputElement = document.getElementById('input') as HTMLInputElement

const resultElement = document.getElementById('result')

const updateElement = document.getElementById('update')

updateElement.addEventListener('click', updateResult)
