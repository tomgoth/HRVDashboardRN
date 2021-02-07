#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(HRV, RCTEventEmitter)
RCT_EXTERN_METHOD(getLatestHRV:(NSString)dateStr)
RCT_EXTERN_METHOD(getLatestRHR:(NSString)dateStr)
RCT_EXTERN_METHOD(getLatestECG:(NSString)dateStr)
RCT_EXTERN_METHOD(authorizeHealthKit)

@end

