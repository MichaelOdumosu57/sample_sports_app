// testing
import { ComponentFixture } from '@angular/core/testing';
import { configureTestingModuleForComponents, configureTestingModuleForStandaloneComponents, grabComponentInstance, mockTranslateService } from '@app/core/utility/test-utils';

// rxjs
import { Subject } from 'rxjs';

import { PrivacyPolicyComponent } from './privacy-policy.component';


describe('PrivacyPolicyComponent', () => {
  let cpnt: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await configureTestingModuleForStandaloneComponents(PrivacyPolicyComponent);
    ({fixture, cpnt} =  grabComponentInstance(PrivacyPolicyComponent));
    fixture.detectChanges()
  })

  describe("init", () => {

    it("should create", () => {
      expect(cpnt).toBeTruthy()
    })

    it("should have all values initalize properly", () => {
      expect(cpnt.myClass).toEqual('PrivacyPolicyView')
    })

    it("should have all properties be the correct class instance", () => {
      expect(cpnt.ngUnsub).toBeInstanceOf(Subject<void>)
    })
  })

  describe("ngOnDestroy",()=>{

    beforeEach(()=>{
      spyOn(cpnt.ngUnsub,'next')
      spyOn(cpnt.ngUnsub,'complete')
    })

    it(` when called |
     as appropriate |
     does the required action `,()=>{
        // act
        cpnt.ngOnDestroy();

        // assert
        expect(cpnt.ngUnsub.next).toHaveBeenCalled();
        expect(cpnt.ngUnsub.complete).toHaveBeenCalled();
    })
  })
});
