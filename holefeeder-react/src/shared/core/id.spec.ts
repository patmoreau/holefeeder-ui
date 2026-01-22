import { Id, IdErrors } from '@/shared/core/id';

// A small set of canonical UUIDs for testing
const validUuids = [
  '00000000-0000-1000-8000-000000000000', // v1, variant 8
  '123e4567-e89b-12d3-a456-426614174000', // v1, variant a
  '550e8400-e29b-41d4-a716-446655440000', // v4, variant a
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', // v4, variant a
  '3F2504E0-4F89-11D3-9A0C-0305E82C3301', // uppercase, v1, variant 9
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // v1, variant 8
  '6ba7b811-9dad-11d1-80b4-00c04fd430c8', // v1, variant 8
  '6ba7b812-9dad-11d1-90b4-00c04fd430c8', // v1, variant 9
  '6ba7b814-9dad-11d1-a0b4-00c04fd430c8', // v1, variant a
  '6ba7b815-9dad-11d1-b0b4-00c04fd430c8', // v1, variant b
];

const invalidUuids = [
  '', // empty
  'not-a-uuid', // random text
  '550e8400e29b41d4a716446655440000', // missing dashes
  '550e8400-e29b-61d4-a716-446655440000', // invalid version 6
  '550e8400-e29b-41d4-g716-446655440000', // invalid hex char 'g'
  '550e8400-e29b-41d4-c716-446655440000', // invalid variant 'c' (should be 8,9,a,b)
  '550e8400-e29b-41d4-a716-44665544000', // too short
  '550e8400-e29b-41d4-a716-4466554400000', // too long
  '123e4567-e89b-12d3-4456-426614174000', // missing variant section pattern
  '123e4567e89b12d3a456426614174000', // no dashes
];

describe('Id', () => {
  it.each(validUuids)('accepts a uuid (%s)', (uuid) => {
    const result = Id.create(uuid);
    expect(result).toBeSuccessWithValue(uuid);
  });

  it.each(invalidUuids)('fails for invalid UUID (%s)', (uuid) => {
    const result = Id.create(uuid as string);
    expect(result).toBeFailureWithErrors([IdErrors.invalid]);
  });

  it('is case-insensitive for hex digits', () => {
    const lower = 'a987fbc9-4bed-3078-cf07-9141ba07c9f3'; // v3 variant c (invalid variant)
    const upper = lower.toUpperCase();

    // Both should fail because variant nibble is 'c', which is not allowed by the schema
    expect(Id.create(lower)).toBeFailureWithErrors([IdErrors.invalid]);
    expect(Id.create(upper)).toBeFailureWithErrors([IdErrors.invalid]);

    // A valid lowercase and uppercase should both pass
    const lowerValid = 'a987fbc9-4bed-3078-8f07-9141ba07c9f3'.toLowerCase(); // v3, variant 8
    const upperValid = lowerValid.toUpperCase();
    expect(Id.create(lowerValid)).toBeSuccessWithValue(lowerValid);
    expect(Id.create(upperValid)).toBeSuccessWithValue(upperValid);
  });
});
