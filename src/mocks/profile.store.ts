import { makeAutoObservable } from 'mobx'

/**
 * Design-phase account data. Mirrors the live endpoints:
 * /user/info, /user/company/info, /user/address/list|manage, /user/receiver/list|manage, /cards/list|bind|unbind,
 * /user/bank-account/list|manage. Everything here is a SAMPLE for design review; checkout reads the same lists.
 */
export interface Address {
  guid: string
  /** "Город, улица, дом" (from the map) */
  address: string
  apartment: string
  floor: string
  /** Comment for the courier */
  comment?: string
  is_default: boolean
}
export interface Receiver {
  guid: string
  fullname: string
  phone: string
  is_default: boolean
}
export interface Card {
  guid: string
  /** Last 4 digits */
  last4: string
  type: 'UZCARD' | 'HUMO'
}
export type AccountStatus = 'approved' | 'pending' | 'rejected'
export interface BankAccount {
  guid: string
  /** "main" is shown as "Главный" */
  name: string
  bank_account: string
  is_default: boolean
  /** The account from registration: can't be edited or deleted. */
  is_initial: boolean
  status: AccountStatus
}

/** /user/company/info. login_status "tin" (company) or "pinfl" (sole trader) decides which fields show. */
export const SAMPLE_COMPANY = {
  login_status: 'tin' as 'tin' | 'pinfl',
  name: 'OOO «OFFICE SOLUTIONS GROUP»',
  tin: '307 845 912',
  na1name: 'Общество с ограниченной ответственностью',
  address: 'г. Ташкент, Мирабадский район, ул. Авлиё Ота, д. 7',
  statusname: 'Действующее',
  director: 'Каримов Азиз Рустамович',
  regdate: '2019-03-14',
  bankaccount: '20208000905123456001',
  bankcode: '00440',
  oked: '46690',
  vat_payer: true,
  directorpinfl: '31203876540021',
}

/** Sample map picks: the live map turns the tapped point into an address (Yandex geocoder). */
export const SAMPLE_MAP_ADDRESSES = [
  'г. Ташкент, Мирабадский район, ул. Авлиё Ота, д. 7',
  'г. Ташкент, Юнусабадский район, ул. Амира Темура, 107Б',
  'г. Ташкент, Чиланзарский район, ул. Бунёдкор, 15',
  'г. Ташкент, Яккасарайский район, ул. Шота Руставели, 41',
  'г. Ташкент, Шайхантахурский район, ул. Навои, 30',
]

let seq = 100
const id = (p: string) => `${p}${++seq}`

const onlyDefault = <T extends { guid: string; is_default: boolean }>(list: T[], guid: string) => list.map((x) => ({ ...x, is_default: x.guid === guid }))

class MockProfileStore {
  user = { fullname: 'Азиз Каримов', phone: '+998 90 123 45 67', /** live: vip_categories not empty */ vip: true }
  company = SAMPLE_COMPANY
  /** Live "Настройки" switches. The current site keeps them on the page only (no API call). */
  settings = { orderPush: true, orderSms: false, promoPush: true, promoSms: false }

  addresses: Address[] = [
    { guid: 'a1', address: SAMPLE_MAP_ADDRESSES[0], apartment: '3', floor: '3', comment: 'БЦ OASIS, вход со двора', is_default: true },
    { guid: 'a2', address: SAMPLE_MAP_ADDRESSES[1], apartment: '12', floor: '2', is_default: false },
  ]
  receivers: Receiver[] = [
    // The account owner is always in the list (live: can't be edited or deleted)
    { guid: 'r1', fullname: 'Азиз Каримов', phone: '+998 90 123 45 67', is_default: true },
    { guid: 'r2', fullname: 'Дилноза Рахимова', phone: '+998 93 765 43 21', is_default: false },
  ]
  cards: Card[] = [
    { guid: 'c1', last4: '4512', type: 'UZCARD' },
    { guid: 'c2', last4: '0731', type: 'HUMO' },
  ]
  bankAccounts: BankAccount[] = [
    { guid: 'b1', name: 'main', bank_account: '20208000905123456001', is_default: true, is_initial: true, status: 'approved' },
    { guid: 'b2', name: 'Капиталбанк', bank_account: '20208000400987654002', is_default: false, is_initial: false, status: 'pending' },
    { guid: 'b3', name: 'Hamkorbank', bank_account: '20208000600555444003', is_default: false, is_initial: false, status: 'rejected' },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  toggleSetting(key: keyof MockProfileStore['settings']) {
    this.settings[key] = !this.settings[key]
  }

  setFullname(v: string) {
    this.user.fullname = v
    this.receivers = this.receivers.map((r) => (r.phone === this.user.phone ? { ...r, fullname: v } : r))
  }
  setPhone(v: string) {
    this.receivers = this.receivers.map((r) => (r.phone === this.user.phone ? { ...r, phone: v } : r))
    this.user.phone = v
  }

  // Addresses
  saveAddress(a: Omit<Address, 'guid' | 'is_default'>, guid?: string) {
    if (guid) this.addresses = this.addresses.map((x) => (x.guid === guid ? { ...x, ...a } : x))
    else this.addresses = [...this.addresses, { ...a, guid: id('a'), is_default: this.addresses.length === 0 }]
    return guid ?? this.addresses[this.addresses.length - 1].guid
  }
  defaultAddress(guid: string) {
    this.addresses = onlyDefault(this.addresses, guid)
  }
  removeAddress(guid: string) {
    this.addresses = this.addresses.filter((x) => x.guid !== guid)
  }

  // Recipients
  saveReceiver(r: { fullname: string; phone: string }, guid?: string) {
    if (guid) this.receivers = this.receivers.map((x) => (x.guid === guid ? { ...x, ...r } : x))
    else this.receivers = [...this.receivers, { ...r, guid: id('r'), is_default: false }]
    return guid ?? this.receivers[this.receivers.length - 1].guid
  }
  defaultReceiver(guid: string) {
    this.receivers = onlyDefault(this.receivers, guid)
  }
  removeReceiver(guid: string) {
    this.receivers = this.receivers.filter((x) => x.guid !== guid)
  }
  hasReceiverPhone(phone: string, except?: string) {
    const d = phone.replace(/\D/g, '')
    return this.receivers.some((r) => r.guid !== except && r.phone.replace(/\D/g, '') === d)
  }

  // Cards
  addCard(last4: string) {
    const card: Card = { guid: id('c'), last4, type: last4.startsWith('9') ? 'HUMO' : 'UZCARD' }
    this.cards = [...this.cards, card]
    return card.guid
  }
  removeCard(guid: string) {
    this.cards = this.cards.filter((c) => c.guid !== guid)
  }

  // Bank accounts (new ones are checked by Kansler first: "В проверке")
  saveBankAccount(a: { name: string; bank_account: string }, guid?: string) {
    if (guid) this.bankAccounts = this.bankAccounts.map((x) => (x.guid === guid ? { ...x, ...a, status: 'pending' } : x))
    else this.bankAccounts = [...this.bankAccounts, { ...a, guid: id('b'), is_default: this.bankAccounts.length === 0, is_initial: false, status: 'pending' }]
  }
  defaultBankAccount(guid: string) {
    this.bankAccounts = onlyDefault(this.bankAccounts, guid)
  }
  removeBankAccount(guid: string) {
    this.bankAccounts = this.bankAccounts.filter((x) => x.guid !== guid)
  }
}

export const mockProfile = new MockProfileStore()
