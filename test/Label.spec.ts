import { expect } from 'chai';
import { Instant } from '../src/Instant';
import { LabelAdapter } from '../src/Label';
import {instance, mock, when} from 'ts-mockito';

describe('Instant', () => {
    let labelAdapter: LabelAdapter;

    beforeEach(() => {
        labelAdapter = mock();
    })
})