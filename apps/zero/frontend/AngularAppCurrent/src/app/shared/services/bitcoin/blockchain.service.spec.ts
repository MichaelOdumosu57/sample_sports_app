// testing
import { configureTestingModuleForServices } from '@core/utility/test-utils';
import { TestBed } from '@angular/core/testing';

// services
import { UtilityService } from '@core/utility/utility.service';

import { BlockchainService } from './blockchain.service';

describe('BlockchainService', () => {
  let service: BlockchainService;
  let utilService:UtilityService

  beforeEach(() => {
    service = configureTestingModuleForServices(BlockchainService)
    utilService =TestBed.inject(UtilityService)
  });

  describe("init", () => {

    it("should create", () => {
      expect(service).toBeTruthy()
    })

    it("should have all values initalize properly", () => {
    })

    it("should have all properties be the correct class instance", () => {

    })
  })
});
