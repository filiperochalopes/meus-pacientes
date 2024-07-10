import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($masterKey: String!, $user: UserInput) {
    patients(masterKey: $masterKey, user: $use) {
      id
    }
  }
`;

export const SIGNIN = gql`
  mutation signing($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      user {
        id
        name
        institutionRoles {
          institution {
            name
          }
          role {
            name
          }
        }
      }
      token
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation updatePatient($id: ID!, $patient: PatientInput!) {
    updatePatient(id: $id, patient: $patient) {
      id
    }
  }
`;

export const CREATE_OR_UPDATE_LAB_TEST_ARRIVAL = gql`
  mutation CreateOrUpdateLabTestArrival($id: Int, $item: LabTestArrivalInput!) {
    createOrUpdateLabTestArrival(id: $id, item: $item) {
      id
      patient {
        name
        cpf
      }
      arrivalDate
      labTestDate
      pickDate
    }
  }
`;

export const CREATE_OR_UPDATE_PREGNANCY = gql`
  mutation CreateOrUpdatePregnancy(
    $id: Int
    $patientName: String!
    $patientDob: String!
    $lastMenstrualPeriod: String!
    $parity: String!
    $pregnancyFirstUsgDate: String
    $pregnancyFirstUsgDay: Int
    $pregnancyFirstUsgWeek: Int
    $observations: String
    $risk: RiskEnum
    $communityHealthAgentId: Int
    $dateOfBirth: String
  ) {
    createOrUpdatePregnancy(
      item: {
        id: $id
        patient: {
          name: $patientName
          dob: $patientDob
          communityHealthAgentId: $communityHealthAgentId
        }
        lastMenstrualPeriod: $lastMenstrualPeriod
        parity: $parity
        pregnancyFirstUsgDate: $pregnancyFirstUsgDate
        pregnancyFirstUsgDay: $pregnancyFirstUsgDay
        pregnancyFirstUsgWeek: $pregnancyFirstUsgWeek
        observations: $observations
        risk: $risk
        dateOfBirth: $dateOfBirth
      }
    ) {
      id
    }
  }
`;
