import { gql } from "@apollo/client";

export const GET_PRESCRIPTION_LIST = gql`
  query GetPrescriptionList {
    getPrescriptionList {
      dosage
      origin
      reason
      observations
      lastRenovation
      withdrawalAttempt
      patient {
        name
        birthdate
        sex
        age
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
      birthdate
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
