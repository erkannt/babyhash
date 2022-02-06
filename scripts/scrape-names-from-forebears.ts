import { pipe } from 'fp-ts/lib/function'
import { data } from './example-data'
import { JSDOM } from 'jsdom';
import * as RA from 'fp-ts/ReadonlyArray';

const extractName = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.name')),
  RA.map((element) => element.innerHTML)
)

const scrape = async () => {
	//const {data} = await (axios.get('https://forebears.io/forenames/begining-with/a'))
	const result = pipe (
		data,
    JSDOM.fragment,
    extractName,
	)
  console.log(result)
}

scrape()
