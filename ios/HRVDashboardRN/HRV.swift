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
  func getLatestHRV(_ dateStr: NSString) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    var startdate = Date.distantPast
    if let date = formatter.date(from: dateStr as String) {
      startdate = date.addingTimeInterval(1)
    }
    getMostRecentHRSeriesSamples(limit: 100, startDate: startdate)
  }
  
  @objc
  func getHRVSince() {
    getMostRecentHRSeriesSamples(limit: 5000, startDate: Date.distantPast)
  }
  
  @objc
  func getLatestRHR(_ dateStr: NSString) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    var startdate = Date.distantPast
    if let date = formatter.date(from: dateStr as String) {
      startdate = date.addingTimeInterval(1)
    }
    getMostRecentRHRs(limit: 100, startDate: startdate)
  }
  
  @objc
  func getRHRSince() {
    getMostRecentRHRs(limit: 5000, startDate: Date.distantPast)
  }
  
  @objc
  func getLatestECG(_ dateStr: NSString) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    var startdate = Date.distantPast
    if let date = formatter.date(from: dateStr as String) {
      startdate = date.addingTimeInterval(1)
    }
    getMostRecentECGs(limit: 100, startDate: startdate)
  }
  
  @objc
  func getMostRecentHRSeriesSamples(limit: Int, startDate: Date) {
    getHRSeriesSamples(limit: limit, startDate: startDate) { (samples, error) in
      
      guard let samples = samples else {
        
        if let error = error {
          print(error.localizedDescription)
        }
        
        return
      }
      self.sendEvent(withName: "HRVResultCount", body:["resultCount": samples.count])
      for sample in samples {
        print(sample)
        self.getBeatToBeatMeasurments(seriesSample: sample)
      }
      
    }
    
  }
  
  @objc
  func getHRSeriesSamples(limit: Int, startDate: Date, completion: @escaping ([HKHeartbeatSeriesSample]?, Error?) -> Swift.Void) {
    
    //1. Use HKQuery to load the most recent samples.
    
    let mostRecentPredicate = HKQuery.predicateForSamples(withStart: startDate,
                                                          end: Date(),
                                                          options: .strictEndDate)
    
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                          ascending: false)
    
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
  func getECGSamples(limit: Int, startDate: Date, completion: @escaping ([HKElectrocardiogram]?, Error?) -> Swift.Void) {
    
    //1. Use HKQuery to load the most recent samples.
    let mostRecentPredicate = HKQuery.predicateForSamples(withStart: startDate,
                                                          end: Date(),
                                                          options: .strictEndDate)
    
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                          ascending: false)
    
    let sampleQuery = HKSampleQuery(sampleType: HKObjectType.electrocardiogramType(),
                                    predicate: mostRecentPredicate,
                                    limit: limit,
                                    sortDescriptors: [sortDescriptor]) { (query, samples, error) in
      
      //2. Always dispatch to the main thread when complete.
      DispatchQueue.main.async {
        
        guard let samples = samples as? [HKElectrocardiogram] else {
          
          completion(nil, error)
          return
        }
        
        completion(samples, nil)
        
      }
    }
    
    HKHealthStore().execute(sampleQuery)
  }
  
  @objc
  func getBeatToBeatMeasurments(seriesSample: HKHeartbeatSeriesSample)  {
    let endDate = seriesSample.endDate
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
    sendEvent(withName: "OnHRVComplete", body: ["beatData": parameters]) //send each reading beat data to react native app
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
            let hrv = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)
    else {
      
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
                                                   HKSeriesType.heartbeat(),
                                                   HKObjectType.electrocardiogramType()]
    //4. Request Authorization
    HKHealthStore().requestAuthorization(toShare: healthKitTypesToWrite,
                                         read: healthKitTypesToRead) { (success, error) in
      //                                            return success
    }
    return true
  }
  
  @objc
  func getMostRecentRHRs(limit: Int, startDate: Date) {
    guard let sampleType = HKSampleType.quantityType(forIdentifier: .restingHeartRate) else {
      print("HR Sample Type is no longer available in HealthKit")
      return
    }
    
    self.getSamples(for: sampleType, limit: limit, startDate: startDate) { (samples, error) in
      
      guard let samples = samples else {
        
        if let error = error {
          print(error.localizedDescription)
        }
        
        return
      }
      self.sendEvent(withName: "RHRResultCount", body:["resultCount": samples.count])
      
      guard let rhrSamples = samples as? [HKQuantitySample] else {
        fatalError("*** Unable to convert \(String(describing: samples)) to [HKQuantitySample] ***")
      }
      for sample in rhrSamples {
        let heartRateSample = sample.quantity.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
        let timestamp = sample.endDate
        let sampleJson = "{\"heartrate\":\(heartRateSample),\"timestamp\":\"\(timestamp)\"}"
        self.sendEvent(withName: "OnRHRComplete", body: ["rhrData": sampleJson]) //send each reading beat data to react native app
        
      }
    }
  }
  
  @objc
  func getMostRecentECGs(limit: Int, startDate: Date) {
    
    self.getECGSamples(limit: limit, startDate: startDate) { (samples, error) in
      guard let samples = samples else {
        
        if let error = error {
          print(error.localizedDescription)
        }
        return
      }
      var sampleCount = 0
      for sample in samples {
        if (sample.classification == HKElectrocardiogram.Classification.sinusRhythm) {
          self.getECGData(sample: sample)
          sampleCount += 1
        }
      }
      self.sendEvent(withName: "ECGResultCount", body:["resultCount": sampleCount])

    }
  }
  
  @objc
  func getECGData(sample: HKElectrocardiogram) {
    //similar to beat to beat data
    let endDate = sample.endDate
    let semaphore = DispatchSemaphore (value: 0)
    var postParams = ""
    let averageHR = sample.averageHeartRate?.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
    
    
    if (sample.classification == HKElectrocardiogram.Classification.sinusRhythm) {
      // Create a query for the voltage measurements
      let voltageQuery = HKElectrocardiogramQuery(sample) { (query, result) in
        switch(result) {
        
        case .measurement(let measurement):
          if let voltageQuantity = measurement.quantity(for: .appleWatchSimilarToLeadI)?.doubleValue(for: HKUnit.volt()) {
            let timeSinceSeriesStart = measurement.timeSinceSampleStart
            // Do something with the voltage quantity here.
            postParams = postParams + "{\"timeSinceSeriesStart\":\(timeSinceSeriesStart),\"voltageQuantity\":\(voltageQuantity)},"
          }
          
        case .done:
          // No more voltage measurements. Finish processing the existing measurements.
          semaphore.signal() //query is finished, resume
        
        case .error(let error):
          // Handle the error here.
          print("ecg query error", error)
          
        default:
          print("ecg query error")
        }
      }
      
      HKHealthStore().execute(voltageQuery)
      
      semaphore.wait() // wait for query to finish
      
      let parameters = "{\"ecg\": [\(postParams.dropLast())],\"date\":\"\(endDate)\",\"averageHR\":\(averageHR ?? 0)}" //remove last , and add brackets for JSON array
      sendEvent(withName: "OnECGComplete", body: ["ecgData": parameters]) //send each reading beat data to react native app
    }
    
    
  }
  
  @objc
  func getSamples(for sampleType: HKSampleType, limit: Int, startDate: Date,
                  completion: @escaping ([HKSample]?, Error?) -> Swift.Void) {
    
    //1. Use HKQuery to load the most recent samples.
    let mostRecentPredicate = HKQuery.predicateForSamples(withStart: startDate,
                                                          end: Date(),
                                                          options: .strictEndDate)
    
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                          ascending: false)
    
    let sampleQuery = HKSampleQuery(sampleType: sampleType,
                                    predicate: mostRecentPredicate,
                                    limit: limit,
                                    sortDescriptors: [sortDescriptor]) { (query, samples, error) in
      
      //2. Always dispatch to the main thread when complete.
      DispatchQueue.main.async {
        
        guard let samples = samples as? [HKQuantitySample] else {
          
          completion(nil, error)
          return
        }
        
        completion(samples, nil)
        
      }
    }
    
    HKHealthStore().execute(sampleQuery)
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Returns an array of your named events
  @objc
  override func supportedEvents() -> [String]! {
    return ["OnHRVComplete", "OnRHRComplete", "OnECGComplete", "NoResults", "HRVResultCount", "RHRResultCount", "ECGResultCount"]
  }
  
}
