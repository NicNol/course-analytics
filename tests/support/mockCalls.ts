export function firstCallArguments<Arguments extends unknown[]>(mockFunction: { mock: { calls: Arguments[] } }) {
  const [firstCall] = mockFunction.mock.calls;
  if (!firstCall) throw new Error("Expected the mock to have been called");
  return firstCall;
}

export function firstInvocationOrder(mockFunction: { mock: { invocationCallOrder: number[] } }) {
  const [firstOrder] = mockFunction.mock.invocationCallOrder;
  if (firstOrder === undefined) throw new Error("Expected the mock to have been called");
  return firstOrder;
}
