// keyValue.pipe.spec.ts

import { TestBed } from '@angular/core/testing';
import { EaStoreService } from 'ea/ea-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationPipe } from './localization.pipe';
class MockLocalizationService {
     localizedString: Map<string, string> = new Map([
        ['common.TEST_MSG_DYNAMIC','This is a test message, {value} is dynamic value'],
        ['common.TEST_MSG_DYNAMIC_1','This is a test message, {value} is dynamic value for {name}'],
        ['common.TEST_MSG_DYNAMIC_2','This is a test message, dynamic value for {name}'],
        ['common.TEST_MESSAGE','TEST MESSAGE'],
        ['common.TEST_MSG_DYNAMIC_NO_VALUE', 'This is a test message, {no_Value} is dynamic value'],
        ['common.ARRAY', 'This is a test 1,2,3']
    ])
    getLocalizedString(key) {
        const value = this.localizedString.get(key);
        if(value){
          return value
        }
        
    }
  }
describe('LocalizationPipe', () => {
  let pipe: LocalizationPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalizationPipe,{ provide: LocalizationService, useClass: MockLocalizationService },EaStoreService]
    });
    pipe = TestBed.inject(LocalizationPipe);
  });

  it('normal key value message without input', () => {
    expect(pipe.transform('common.TEST_MESSAGE', 3)).toBe('TEST MESSAGE');
  });
  it('key value message with one dynamic value', () => {
    expect(pipe.transform('common.TEST_MSG_DYNAMIC', 3,{value:'Test'})).toBe('This is a test message, Test is dynamic value');
  });

  it('key value message with multiple dynamic value', () => {
    expect(pipe.transform('common.TEST_MSG_DYNAMIC_1', 3,{value:'Test',name:'Sam'})).toBe('This is a test message, Test is dynamic value for Sam');
  });

  it('key value message with one dynamic value but invalid input', () => {
    expect(pipe.transform('common.TEST_MSG_DYNAMIC_2', 3,{value:'Test'})).toBe('This is a test message, dynamic value for {name}');
  });

  it('key value message with  dynamic value but no input', () => {
    expect(pipe.transform('common.TEST_MSG_DYNAMIC_NO_VALUE', 3)).toBe('This is a test message, {no_Value} is dynamic value');
  });
  it('invalid key', () => {
    expect(pipe.transform('common.test', 3)).toBe('');
  });
  it('key value message with  dynamic array value', () => {
    expect(pipe.transform('common.ARRAY', 3,{data:['1','2','3']})).toBe('This is a test 1,2,3');
  });
  
});
