import ExpoModulesCore
import os

public class ExpoOSLogger: Module {
  private let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "expo.app", category: "JS")

  public func definition() -> ModuleDefinition {
    Name("ExpoOSLogger")

    Function("log") { (message: String, level: String) in
      switch level.lowercased() {
      case "error": logger.error("\(message, privacy: .public)")
      case "warn":  logger.warning("\(message, privacy: .public)")
      default:      logger.info("\(message, privacy: .public)")
      }
    }
  }
}