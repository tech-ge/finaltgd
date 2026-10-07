export enum WalletTab {
  Home = 'home',
  Deposit = 'deposit',
  Send = 'send',
  History = 'history',
}

export enum AttendanceStatus {
  AutomaticGeoMatch = 'AUTOMATIC_GEO_MATCH',
  FailedIp = 'FAILED_IP',
  FailedGeo = 'FAILED_GEO',
  ManualOverride = 'MANUAL_OVERRIDE',
}

export enum TransferOperation {
  DepositFiat = 'DEPOSIT_FIAT',
  SendInternal = 'SEND_INTERNAL',
  SendBusiness = 'SEND_BUSINESS',
  EscrowLock = 'ESCROW_LOCK',
  EscrowRelease = 'ESCROW_RELEASE',
  MoveToEarn = 'MOVE_TO_EARN',
}
