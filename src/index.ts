import {sha512} from 'js-sha512'

export function updateResult() {
  const inputElement = document.getElementById('input')

  const resultElement = document.getElementById('result')

  resultElement.textContent = sha512.hex(inputElement.textContent)
}

const updateElement = document.getElementById('update')

updateElement.addEventListener('click', updateResult)
