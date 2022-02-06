import { flow, pipe } from 'fp-ts/lib/function'
import { aData }  from './a'
import { JSDOM } from 'jsdom';
import * as RA from 'fp-ts/ReadonlyArray';
import axios from 'axios'
import * as T from 'fp-ts/Task';
import { bData } from './b';

const zip = <A>(arr: ReadonlyArray<A>, ...arrs: ReadonlyArray<ReadonlyArray<A>>) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const extractName = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.name')),
  RA.map((element) => element.innerHTML)
)

const extractIncidence = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.detail-value')),
  RA.map((element) => element.innerHTML)
)


const extractNameAndIncidence = (input: DocumentFragment) => {
  const names = extractName(input)
  const incidence = extractIncidence(input)

  return zip(names, incidence)
}


const getData = (url: string) => async () => {
	//const {data} = await (axios.get(url))
  if (url.endsWith('a')) {
    return aData
  }
  return bData
}

const scrape = async () => {
	const result = await pipe (
    ['a', 'b'],
    RA.map((letter) => `https://forebears.io/forenames/begining-with/${letter}`),
		T.traverseArray(getData),
    T.map(flow(
      RA.map(JSDOM.fragment),
      RA.map(extractNameAndIncidence),
      RA.flatten,
    ))
	)()
  console.log(result)
}

scrape()
