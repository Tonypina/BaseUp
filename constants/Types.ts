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
  opposing_team: string,
  players: playerType & {is_flex: boolean}[]
}

export type teamType = {
  id: string,
  name: string,
  logo: string,
  manager: string,
  coach: string,
  players: playerType[]
}

export const initialValuesTeam = {
  name: '',
  logo: '',
  players: [],
  manager: '',
  team: '',
}

export const initialValuesPlayer = {
  name: '',
  number: '',
  positions: []
}
