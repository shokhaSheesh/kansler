import { useQuery } from '@tanstack/react-query'
import { mainPageApi } from './api'

const long = 10 * 60_000

export const useBanners = () =>
  useQuery({ queryKey: ['BANNERS'], queryFn: mainPageApi.banners, select: (r) => r.data.data, staleTime: long })
export const usePartners = () =>
  useQuery({ queryKey: ['PARTNERS'], queryFn: mainPageApi.partners, select: (r) => r.data.data, staleTime: long })
export const useContacts = () =>
  useQuery({ queryKey: ['CONTACTS'], queryFn: mainPageApi.contacts, select: (r) => r.data, staleTime: long })
export const useFaqs = () =>
  useQuery({ queryKey: ['FAQS'], queryFn: mainPageApi.faqs, select: (r) => r.data.data, staleTime: long })
export const useHelpCenter = () =>
  useQuery({ queryKey: ['HELP_CENTER'], queryFn: mainPageApi.helpCenter, select: (r) => r.data.data, staleTime: long })
