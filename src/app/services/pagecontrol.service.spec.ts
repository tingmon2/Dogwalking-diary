import { TestBed } from '@angular/core/testing';

import { PagecontrolService } from './pagecontrol.service';

describe('PagecontrolService', () => {
  let service: PagecontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagecontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
