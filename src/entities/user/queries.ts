import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { userApi } from './api'

export const userKeys = {
  info: ['USER_INFO'] as const,
  summary: ['USER_COUNT_SUMMARY'] as const,
  addresses: ['ADDRESS_LIST'] as const,
  receivers: ['RECEIVER_LIST'] as const,
  bankAccounts: ['BANK_ACCOUNT_LIST'] as const,
  company: ['COMPANY_INFO'] as const,
}

const enabled = () => authStore.isAuthorized

export const useUser = () =>
  useQuery({ queryKey: userKeys.info, queryFn: () => userApi.get(), enabled: enabled() })

export const useCountSummary = () =>
  useQuery({ queryKey: userKeys.summary, queryFn: userApi.countSummary, enabled: enabled() })

export const useAddresses = () =>
  useQuery({ queryKey: userKeys.addresses, queryFn: () => userApi.addressList(), enabled: enabled() })

export const useReceivers = () =>
  useQuery({ queryKey: userKeys.receivers, queryFn: () => userApi.receiverList(), enabled: enabled() })

export const useBankAccounts = () =>
  useQuery({ queryKey: userKeys.bankAccounts, queryFn: () => userApi.bankAccountList(), enabled: enabled() })

export const useCompanyInfo = () =>
  useQuery({ queryKey: userKeys.company, queryFn: () => userApi.companyInfo(), enabled: enabled() })

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.info }),
  })
}

export const useManageAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.addressManage,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.addresses }),
  })
}

export const useManageReceiver = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.receiverManage,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.receivers }),
  })
}

export const useManageBankAccount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.bankAccountManage,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.bankAccounts }),
  })
}
