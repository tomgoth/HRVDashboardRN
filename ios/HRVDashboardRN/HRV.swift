//
//  HRV.swift
//  HRVDashboardRN
//
//  Created by Goth, Thomas on 4/21/20.
//

import Foundation
import HealthKit


@objc(HRV)
class HRV: RCTEventEmitter {
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Returns an array of your named events
  @objc
  override func supportedEvents() -> [String]! {
    return ["OnHRVComplete"]
  }
  
  @objc
  func getLatestHRV() {
    getMostRecentHRVSeriesSample()
  }
  
  @objc
  func getHRVSince() {
    getMostRecentHRSeriesSamples()
  }
  
  @objc
  func getMostRecentHRSeriesSamples() {
          getHRSeriesSamples() { (samples, error) in
              
              guard let samples = samples else {
                  
                  if let error = error {
                      print(error.localizedDescription)
                  }
                  
                  return
              }
              
              for sample in samples {
                  print(sample)
                self.getBeatToBeatMeasurments(seriesSample: sample)
              }
              
          }
    
  }
  
  @objc
  func getHRSeriesSamples(completion: @escaping ([HKHeartbeatSeriesSample]?, Error?) -> Swift.Void) {
      
      //1. Use HKQuery to load the most recent samples.

      let mostRecentPredicate = HKQuery.predicateForSamples(withStart: Date.distantPast,
                                                            end: Date(),
                                                            options: .strictEndDate)
      
      let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                            ascending: false)
      
      let limit = 10
      
      let sampleQuery = HKSampleQuery(sampleType: HKSeriesType.heartbeat(),
                                      predicate: mostRecentPredicate,
                                      limit: limit,
                                      sortDescriptors: [sortDescriptor]) { (query, samples, error) in
                                          
                                          //2. Always dispatch to the main thread when complete.
                                          DispatchQueue.main.async {
                                              
                                              guard let samples = samples as? [HKHeartbeatSeriesSample] else {
                                                      
                                                      completion(nil, error)
                                                      return
                                              }
                                              
                                            completion(samples, nil)
                                              
                                          }
      }
      
      HKHealthStore().execute(sampleQuery)
  }
  
  @objc
  func getMostRecentHRVSeriesSample() {
      
      self.getMostRecentHRSeriesSample() { (sample, error) in
      guard let sample = sample else {
          if let error = error {
              print(error.localizedDescription)
           }
              return
          }
        self.getBeatToBeatMeasurments(seriesSample: sample)
      }
    
      
      
  }
  
  @objc
  func getMostRecentHRSeriesSample(completion: @escaping (HKHeartbeatSeriesSample?, Error?) -> Swift.Void) {
      
      //1. Use HKQuery to load the most recent samples.
//      let semaphore = DispatchSemaphore(value: 0)
      let mostRecentPredicate = HKQuery.predicateForSamples(withStart: Date.distantPast,
                                                            end: Date(),
                                                            options: .strictEndDate)
      
      let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                            ascending: false)
      
      let limit = 1
      
      let sampleQuery = HKSampleQuery(sampleType: HKSeriesType.heartbeat(),
                                      predicate: mostRecentPredicate,
                                      limit: limit,
                                      sortDescriptors: [sortDescriptor]) { (query, samples, error) in
                                          
                                          //2. Always dispatch to the main thread when complete.
                                          DispatchQueue.main.async {
                                              
                                              guard let samples = samples,
                                                  let mostRecentSample = samples.first as? HKHeartbeatSeriesSample else {
                                                      
                                                      completion(nil, error)
                                                      return
                                              }
                                              
                                              completion(mostRecentSample, nil)
//                                              semaphore.signal()
                                              
                                          }
      }
      
      HKHealthStore().execute(sampleQuery)
//      semaphore.wait()
  }
  
  @objc
  func getBeatToBeatMeasurments(seriesSample: HKHeartbeatSeriesSample)  {
      let startDate = seriesSample.startDate
      let endDate = seriesSample.endDate
      print("start date", startDate)
      print("end date", endDate)
//      var returnString = ""
      let semaphore = DispatchSemaphore (value: 0)
      var postParams = ""
      
      let hrseriesquery = HKHeartbeatSeriesQuery(heartbeatSeries: seriesSample) {
          (hrseriesquery, timeSinceSeriesStart, precededByGap, done, error) in
          
          guard error == nil else {
              //handle error
              return
          }
          // build our post JSON
          postParams = postParams + "{\"timeSinceSeriesStart\":\(timeSinceSeriesStart),\"precededByGap\":\(precededByGap)},"
          if (done){
              semaphore.signal() //query is finished, resume
          }
      }
      
      HKHealthStore().execute(hrseriesquery)
      
      semaphore.wait() // wait for query to finish
      
      let parameters = "{\"beatToBeat\": [\(postParams.dropLast())],\"date\":\"\(endDate)\"}" //remove last , and add brackets for JSON array
      print("parameters", parameters)
      
//      let postData = parameters.data(using: .utf8)
      
      //need to make url dynamic
//      var request = URLRequest(url: URL(string: "http://192.168.0.8:3001/gethrv")!,timeoutInterval: Double.infinity)
//      request.addValue("application/json", forHTTPHeaderField: "Content-Type")
//      request.httpMethod = "POST"
//      request.httpBody = postData
//
//      let task = URLSession.shared.dataTask(with: request) { data, response, error in
//          guard let data = data else {
//              print(String(describing: error))
//              return
//          }
//           //shall I do something with the response?
//          returnString = String(data: data, encoding: .utf8)!
//          print(returnString)
//          semaphore.signal()
//      }
//
//      task.resume()
//      semaphore.wait() //wait for REST call to finish
    sendEvent(withName: "OnHRVComplete", body: ["beatData": parameters])
  }
  

  
    @objc
    func authorizeHealthKit() -> Bool {
    //1. Check to see if HealthKit Is Available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
        //completion(false, HealthkitSetupError.notAvailableOnDevice)
        return false
    }
    //2. Prepare the data types that will interact with HealthKit
    guard   let dateOfBirth = HKObjectType.characteristicType(forIdentifier: .dateOfBirth),
        let bloodType = HKObjectType.characteristicType(forIdentifier: .bloodType),
        let biologicalSex = HKObjectType.characteristicType(forIdentifier: .biologicalSex),
        let bodyMassIndex = HKObjectType.quantityType(forIdentifier: .bodyMassIndex),
        let height = HKObjectType.quantityType(forIdentifier: .height),
        let bodyMass = HKObjectType.quantityType(forIdentifier: .bodyMass),
        let heartRate = HKObjectType.quantityType(forIdentifier: .heartRate),
        let restingHeartRate = HKObjectType.quantityType(forIdentifier: .restingHeartRate),
        let hrv = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN),
        let activeEnergy = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) else {
            
            //completion(false, HealthkitSetupError.dataTypeNotAvailable)
            return false
    }
    //3. Prepare a list of types you want HealthKit to read and write
    let healthKitTypesToWrite: Set<HKSampleType> = []
    
    let healthKitTypesToRead: Set<HKObjectType> = [dateOfBirth,
                                                   bloodType,
                                                   biologicalSex,
                                                   bodyMassIndex,
                                                   height,
                                                   bodyMass,
                                                   heartRate,
                                                   restingHeartRate,
                                                   hrv,
                                                   HKObjectType.workoutType(),
                                                   HKSeriesType.heartbeat()]
    //4. Request Authorization
    HKHealthStore().requestAuthorization(toShare: healthKitTypesToWrite,
                                         read: healthKitTypesToRead) { (success, error) in
                                            return success
    }
    return true
  }
  
}
