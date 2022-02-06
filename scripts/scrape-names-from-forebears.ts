import { flow, pipe } from 'fp-ts/lib/function'
import { JSDOM } from 'jsdom';
import * as RA from 'fp-ts/ReadonlyArray';
import axios from 'axios'
import * as T from 'fp-ts/Task';
import * as N from 'fp-ts/number'
import * as Ord from 'fp-ts/Ord'
import * as fs from "fs";

const extractName = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.name')),
  RA.map((element) => element.innerHTML)
)

const extractIncidence = (input: DocumentFragment) => pipe(
  input,
  (html) => Array.from(html.querySelectorAll('.detail-value')),
  RA.map((element) => element.innerHTML),
  RA.map((s) => s.replace(/,/g, '')),
  RA.map((s) => parseInt(s, 10)),
)


const extractNameAndIncidence = (input: DocumentFragment): ReadonlyArray<NameIncidence> => {
  const names = extractName(input)
  const incidence = extractIncidence(input)

  return RA.zip(names, incidence)
}


const getData = (url: string) => async () => {
  const { data } = await (axios.get(url))
  return data
}

type NameIncidence = Readonly<[string, number]>

const scrape = async () => {
  const result = await pipe(
    'aáåâäàæãbcçčćdđďeéèfghiíjklłľmnñňoöøóőõðpqrřsşšșśtţþțťuüúūvwxyzžż',
    (letters) => letters.split(""),
    RA.map(encodeURIComponent),
    RA.map((letter) => `https://forebears.io/forenames/begining-with/${letter}`),
    T.traverseArray(getData),
    T.map(flow(
      RA.map(JSDOM.fragment),
      RA.map(extractNameAndIncidence),
      RA.flatten,
      RA.sort(Ord.contramap((tup: NameIncidence) => tup[1])(N.Ord)),
      RA.reverse,
      JSON.stringify,
    ))
  )()

  const outputFile = './data/names-with-incidence.json'

  fs.writeFile(outputFile, result, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Saved to '${outputFile}'`);
  });
}

scrape()
