import { CountryRepository } from "@app/repositories/countryRepository";

class CountryService {
  private repository: CountryRepository;

  constructor(repository: CountryRepository) {
    this.repository = repository;
  }

  async listCountries() {
    return this.repository.findAll();
  }

  async getCountryByName(name: string) {
    return this.repository.findByName(name);
  }
}

export { CountryService };
