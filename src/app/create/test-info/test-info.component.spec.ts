import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInfoComponent } from './test-info.component';

describe('TestInfoComponent', () => {
  let component: TestInfoComponent;
  let fixture: ComponentFixture<TestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
