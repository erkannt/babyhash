import { pipe } from 'fp-ts/lib/function'
import { data } from './example-data'
import { JSDOM } from 'jsdom';
import * as RA from 'fp-ts/ReadonlyArray';

const zip = <A>(arr: ReadonlyArray<A>, ...arrs: ReadonlyArray<ReadonlyArray<A>>) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const extractName = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.name')),
  RA.map((element) => element.innerHTML)
)

const extractNameAndIncidence = (input: DocumentFragment) => {
  const names = extractName(input)
  const incidence = extractName(input)

  return zip(names, incidence)
}

const scrape = async () => {
	//const {data} = await (axios.get('https://forebears.io/forenames/begining-with/a'))
	const result = pipe (
		data,
    JSDOM.fragment,
    extractNameAndIncidence,
	)
  console.log(result)
}

scrape()
