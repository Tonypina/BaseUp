export type positionType = {
  id: string,
  acronym: string,
  description: string
}

export type playerType = {
  id: string,
  name: string,
  number: string,
  positions: positionType[]
}

export type lineupType = {
  name: string,
  players: playerType[]
}

export type teamType = {
  id: string,
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
