import { makeAutoObservable } from 'mobx'
import { SAMPLE_COMPANY } from './profile.store'

/**
 * Design-phase sign-in / sign-up flow. Live keeps the same data between steps (authStore.setAuthData).
 * Demo rules (no backend): INN/PINFL of zeros → "Ничего не нашлось(";
 * phone +998 90 123 45 67 → "user already exists" on sign-up; +998 99 999 99 99 → "user not found" on reset;
 * SMS code 000000 → wrong code; login password "0000" → wrong password.
 */
export type RegisterType = 'inn' | 'pinfl'

export interface CompanyData {
  tinOrPinfl: string
  name: string
  fullName: string
  address: string
  regDate: string
  na1Name: string
  oked: string
  bankCode: string
  bankAccount: string
  vatRegCode: string
  statusName: string
  director: string
}

export const DEMO = {
  existingPhone: '+998 90 123 45 67',
  unknownPhone: '+998 99 999 99 99',
  wrongCode: '000000',
  wrongPassword: '0000',
}

class AuthFlowStore {
  /** register: sign-up; reset: forgot password */
  mode: 'register' | 'reset' = 'register'
  registerType: RegisterType = 'inn'
  company: CompanyData | null = null
  phone = ''
  fullname = ''
  role = ''

  constructor() {
    makeAutoObservable(this)
  }

  setMode(m: 'register' | 'reset') {
    this.mode = m
  }
  setType(t: RegisterType) {
    this.registerType = t
  }

  /** /auth/register/check: the tax-service lookup. Returns false when nothing is found. */
  lookup(id: string) {
    if (/^0+$/.test(id)) return false
    const c = SAMPLE_COMPANY
    this.company = {
      tinOrPinfl: id,
      name: c.name,
      fullName: c.director,
      address: c.address,
      regDate: '14.03.2019',
      na1Name: c.na1name,
      oked: c.oked,
      bankCode: c.bankcode,
      bankAccount: c.bankaccount,
      vatRegCode: '326050012345',
      statusName: this.registerType === 'inn' ? 'Плательщик НДС' : 'Индивидуальный предприниматель',
      director: c.director,
    }
    return true
  }

  setCompany(c: CompanyData) {
    this.company = c
  }

  setContact(phone: string, fullname = '', role = '') {
    this.phone = phone
    this.fullname = fullname
    this.role = role
  }
}

export const authFlow = new AuthFlowStore()
