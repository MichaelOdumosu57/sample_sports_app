// testing
import { configureTestingModuleForServices } from '@core/utility/test-utils';
import { TestBed } from '@angular/core/testing';

// services
import { UtilityService } from '@core/utility/utility.service';

import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let utilService:UtilityService

  beforeEach(() => {
    service = configureTestingModuleForServices(AccountService)
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
