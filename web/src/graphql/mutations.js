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
