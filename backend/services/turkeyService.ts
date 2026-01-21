import { TurkeyRepository } from "@app/repositories/turkeyRepository";

class TurkeyService {
  private repository: TurkeyRepository;

  constructor(repository: TurkeyRepository) {
    this.repository = repository;
  }

  async listTurkey() {
    return this.repository.findAll();
  }

  async getTurkeyByCity(city: string) {
    return this.repository.findByCity(city);
  }
}

export { TurkeyService };
