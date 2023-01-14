// testing
import { configureTestingModuleForServices } from '@core/utility/test-utils';
import { TestBed } from '@angular/core/testing';

// services
import { UtilityService } from '@core/utility/utility.service';

import { EventsService } from './event.service';

describe('EventService', () => {
  let service: EventsService;
  let utilService:UtilityService

  beforeEach(() => {
    service = configureTestingModuleForServices(EventsService)
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
