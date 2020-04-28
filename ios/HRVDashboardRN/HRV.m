#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(HRV, RCTEventEmitter)
RCT_EXTERN_METHOD(getLatestHRV)
RCT_EXTERN_METHOD(getLatestRHR)
RCT_EXTERN_METHOD(getHRVSince)
RCT_EXTERN_METHOD(getRHRSince)
RCT_EXTERN_METHOD(authorizeHealthKit)

@end

