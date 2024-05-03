import { gql } from "@apollo/client";

export const GET_PRESCRIPTION_LIST = gql`
  query GetPrescriptionList {
    getPrescriptionList {
      id
      dosage
      origin
      reason
      observations
      lastRenovation
      withdrawalAttempt
      patient {
        name
        dob
        sex
        age
        professionals {
          name
          institutionRoles {
            id
            institution {
              name
            }
            role {
              name
            }
          }
        }
      }
    }
  }
`;

export const CID10 = gql`
  query getCid10($query: String) {
    cid10(query: $query) {
      code
      description
    }
  }
`;

export const GET_PATIENTS = gql`
  query patients($queryNameCnsCpf: String) {
    patients(queryNameCnsCpf: $queryNameCnsCpf) {
      id
      name
      dob
      sex
      age
      cns
      rg
      phone
      cpf
      weightKg
      motherName
      comorbidities {
        id
        value
      }
      allergies {
        id
        value
      }
      address {
        zipCode
        street
        number
        neighborhood
        complement
        city
        uf
      }
    }
  }
`;

export const GET_LAB_TEST_ARRIVAL = gql`
  query GetLabTestArrival($cpf: String) {
    getLabTestArrival(cpf: $cpf) {
      id
      patient {
        id
        name
        dob
        cpf
      }
      labTestDate
      arrivalDate
    }
  }
`;
