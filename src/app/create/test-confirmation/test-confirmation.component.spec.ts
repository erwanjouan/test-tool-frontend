import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConfirmationComponent } from './test-confirmation.component';

describe('TestConfirmationComponent', () => {
  let component: TestConfirmationComponent;
  let fixture: ComponentFixture<TestConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
