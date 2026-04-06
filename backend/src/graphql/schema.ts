import { gql } from "graphql-tag";
import Case, { ICase } from "../models/Case";

interface GraphQLCase {
  id: string;
  caseTitle: string;
  clientName: string;
  nextHearingDate: string;
  stage: string;
}

export const typeDefs = gql`
  type Case {
    id: ID!
    caseTitle: String!
    clientName: String!
    nextHearingDate: String!
    stage: String!
  }

  type Query {
    getCaseById(id: ID!): Case
  }

  type Mutation {
    updateCaseStage(id: ID!, stage: String!): Case
  }
`;

export const resolvers = {
  Query: {
    getCaseById: async (
      _: any,
      { id }: { id: string },
    ): Promise<GraphQLCase | null> => {
      const result = (await Case.findById(id).lean()) as ICase | null;
      if (!result) return null;

      return {
        id: result._id.toString(),
        caseTitle: result.caseTitle,
        clientName: result.clientName,
        nextHearingDate: result.nextHearingDate.toISOString(),
        stage: result.stage,
      };
    },
  },

  Mutation: {
    updateCaseStage: async (
      _: any,
      { id, stage }: { id: string; stage: string }, 
    ): Promise<GraphQLCase | null> => {
      const result = (await Case.findByIdAndUpdate(
        id,
        { stage },
        { new: true, lean: true }, 
      )) as ICase | null;

      if (!result) return null;

      return {
        id: result._id.toString(),
        caseTitle: result.caseTitle,
        clientName: result.clientName,
        nextHearingDate: result.nextHearingDate.toISOString(),
        stage: result.stage,
      };
    },
  },
};
