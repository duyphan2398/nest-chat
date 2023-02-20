export enum MEMBER_STATUS {
  ENABLE = 1,
  DISABLE = 0,
}

export enum MEMBER_IS_VERIFY {
  VERIFY = 1,
  NOT_VERIFY = 0,
}

export enum TOKEN_EXPIRED_TIME {
  SECONDS = parseInt(process.env.TOKEN_EXPIRED_TIME),
}
