import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
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
  }
`;

export const COMMUNITY_HEALTH_AGENTS = gql`
  query CommunityHealthAgents {
    communityHealthAgents {
      id
      name
      institutionRoles {
        institution {
          id
          name
        }
      }
    }
  }
`;

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

export const PREGNANTS = gql`
  query Pregnants {
    pregnants {
      patient {
        name
        dob
        age
        communityHealthAgent {
          name
        }
      }
      risk {
        name
        description
      }
      ultrasonographies {
        date
        gestationalAgeDays
        gestationalAgeWeeks
        formatedGestationalAge
      }
      id
      lastMenstrualPeriod
      gestationalAgeLmp
      parity
      dayOfBirth
      observations
    }
  }
`;

export const PREGNANCY = gql`
  query Pregnancy($id: Int!) {
    pregnancy(id: $id) {
      patient {
        name
        dob
        age
        communityHealthAgent {
          id
          name
        }
      }
      risk {
        name
        description
      }
      ultrasonographies {
        date
        gestationalAgeDays
        gestationalAgeWeeks
        formatedGestationalAge
      }
      labTests {
        labTest {
          name
        }
        value
      }
      id
      lastMenstrualPeriod
      gestationalAgeLmp
      gestationalAgeFirstUsg
      formatedGestationalAge
      parity
      dayOfBirth
      observations
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
