import { ObjectId } from '@highoutput/object-id';
import Chance from 'chance';
import mixpanel, { Mixpanel } from 'mixpanel';
import { Analytics } from '../src';

jest.mock('mixpanel');

describe('analytics', () => {
  const chanceHelper = new Chance();
  test('should create an account', async () => {
    const mockedFunction = jest.fn();
    const mockedMixpanelInstance = {
      people: {
        set: mockedFunction,
      },
    };

    (mixpanel as jest.Mocked<typeof mixpanel>).init.mockImplementation(
      () => mockedMixpanelInstance as unknown as Mixpanel,
    );
    const project = chanceHelper.word();
    const analytics = new Analytics({ project });

    const accountDetails = {
      accountId: new ObjectId(chanceHelper.integer()),
      firstname: chanceHelper.first(),
      lastname: chanceHelper.last(),
      email: chanceHelper.email(),
      organizationId: new ObjectId(chanceHelper.integer()),
      created: new Date(),
    };
    analytics.createAccount(accountDetails);

    expect(mockedFunction).toBeCalledTimes(1);
    expect(mockedFunction.mock.calls[0][0]).toEqual(
      accountDetails.accountId.toString(),
    );
    expect(mockedFunction.mock.calls[0][1]).toEqual({
      $distinct_id: accountDetails.accountId.toString(),
      project,
      $first_name: accountDetails.firstname,
      $last_name: accountDetails.lastname,
      $email: accountDetails.email,
      $created: accountDetails.created,
      organizationId: accountDetails.organizationId.toString(),
    });
  });
});
