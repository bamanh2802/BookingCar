import quickActionRepository from '~/repositories/quickActionRepository'

const createQuickAction = async (reqBody) => {
  const result = await quickActionRepository.create(reqBody)
  return result
}

const updateQuickAction = async (quickActionId, reqbody) => {
  const result = await quickActionRepository.updateById(quickActionId, reqbody)
  return result
}

const getAllQuickAction = async (filter, page, limit) => {
  const results = await quickActionRepository.getAllQuickAction(filter, page, limit)
  return results
}
export const quickActionService = { createQuickAction, updateQuickAction, getAllQuickAction }
