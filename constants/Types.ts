export type positionType = {
  acronym: string,
  description: string
}

export type playerType = {
  name: string,
  number: string,
  positions: positionType[]
}

export type teamType = {
  name: string,
  logo: string,
  players: playerType[]
}

export const initialValuesTeam = {
  name: '',
  logo: '',
  players: []
}

export const initialValuesPlayer = {
  name: '',
  number: '',
  positions: []
}
