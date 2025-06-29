import { Types } from 'mongoose'
import ticketRepository from '~/repositories/ticketRepository'
import userRepository from '~/repositories/userRepository'

//only admin
const getAdminRevenue = async (period) => {
  const filter = {}
  const result = await ticketRepository.getRevenueStatsByRole(filter, period)
  return result
}

const getRevenueAgentsLv1 = async (agentLv1Id, period) => {
  const subordinateAgents = await userRepository.findAll({ parentId: agentLv1Id }, '_id')
  const subordinateAgentIds = subordinateAgents.map((agent) => agent._id)

  const allCreatorIds = [new Types.ObjectId(agentLv1Id), ...subordinateAgentIds]

  const filter = {
    createdBy: { $in: allCreatorIds }
  }
  return await ticketRepository.getRevenueStatsByRole(filter, period)
}

const getRevenueAgentsLv2 = async (agentLv2Id, period) => {
  const filter = { createdBy: new Types.ObjectId(agentLv2Id) }
  return await ticketRepository.getRevenueStatsByRole(filter, period)
}
export const adminRevenueService = {
  getAdminRevenue,
  getRevenueAgentsLv1,
  getRevenueAgentsLv2
}
