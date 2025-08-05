import 'package:flutter_test/flutter_test.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/services/period_service.dart';

void main() {
  group('PeriodServiceImpl', () {
    late PeriodServiceImpl periodService;
    late EventBus eventBus;

    setUp(() {
      eventBus = EventBus();
      periodService = PeriodServiceImpl(eventBus: eventBus);

      // Reset to empty settings before each test
      eventBus.fire(UserSettingsChangedEvent(UserSettings.empty));
    });

    group('getCurrentPeriod', () {
      test('should return current period based on today\'s date', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.monthly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        // Act
        final result = await periodService.getCurrentPeriod();

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start, isNotNull);
        expect(result.end, isNotNull);
      });

      test('should throw exception when user settings not found', () async {
        // Ensure we have empty settings
        eventBus.fire(UserSettingsChangedEvent(UserSettings.empty));
        await Future.delayed(Duration(milliseconds: 10));

        // Act & Assert
        expect(
          () => periodService.getCurrentPeriod(),
          throwsA(isA<Exception>()),
        );
      });
    });

    group('calculatePeriod', () {
      test('should calculate monthly period correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.monthly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 2, 15);

        // Act
        final result = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start.year, equals(2024));
        expect(result.start.month, equals(2));
        expect(result.start.day, equals(1));
      });

      test('should calculate weekly period correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1), // Monday
          intervalType: DateIntervalType.weekly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 1, 10);

        // Act
        final result = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start.year, equals(2024));
        expect(result.start.month, equals(1));
        expect(result.start.day, equals(8));
      });

      test('should calculate yearly period correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.yearly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2025, 6, 15);

        // Act
        final result = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start.year, equals(2025));
        expect(result.start.month, equals(1));
        expect(result.start.day, equals(1));
      });

      test('should handle oneTime interval correctly', () async {
        // Arrange
        final effectiveDate = DateTime(2024, 5, 15);
        final userSettings = UserSettings(
          effectiveDate: effectiveDate,
          intervalType: DateIntervalType.oneTime,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 6, 1);

        // Act
        final result = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start.year, equals(2024));
        expect(result.start.month, equals(6));
        expect(result.start.day, equals(1));
        expect(
          result.end.day,
          equals(15),
        ); // oneTime should end same day + 1 day - 1
      });

      test('should handle frequency greater than 1', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.monthly,
          frequency: 3, // Every 3 months
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 5, 15);

        // Act
        final result = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(result, isA<DateInterval>());
        expect(result.start.year, equals(2024));
        expect(result.start.month, equals(4));
        expect(result.start.day, equals(1));
      });

      test('should throw exception when user settings not found', () async {
        // Ensure we have empty settings
        eventBus.fire(UserSettingsChangedEvent(UserSettings.empty));
        await Future.delayed(Duration(milliseconds: 10));

        // Act & Assert
        expect(
          () => periodService.calculatePeriod(DateTime.now()),
          throwsA(isA<Exception>()),
        );
      });
    });

    group('calculateNextDate', () {
      test('should calculate next monthly date correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 15),
          intervalType: DateIntervalType.monthly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 1, 20);

        // Act
        final result = await periodService.calculateNextDate(asOfDate);

        // Assert
        expect(result.year, equals(2024));
        expect(result.month, equals(2));
        expect(result.day, equals(15));
      });

      test('should calculate next weekly date correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.weekly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 1, 5);

        // Act
        final result = await periodService.calculateNextDate(asOfDate);

        // Assert
        expect(result.year, equals(2024));
        expect(result.month, equals(1));
        expect(result.day, equals(8));
      });

      test('should return effective date for oneTime interval', () async {
        // Arrange
        final effectiveDate = DateTime(2024, 5, 15);
        final userSettings = UserSettings(
          effectiveDate: effectiveDate,
          intervalType: DateIntervalType.oneTime,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 6, 1);

        // Act
        final result = await periodService.calculateNextDate(asOfDate);

        // Assert
        expect(result, equals(DateTime(2024, 5, 15)));
      });

      test('should throw exception when user settings not found', () async {
        // Ensure we have empty settings
        eventBus.fire(UserSettingsChangedEvent(UserSettings.empty));
        await Future.delayed(Duration(milliseconds: 10));

        // Act & Assert
        expect(
          () => periodService.calculateNextDate(DateTime.now()),
          throwsA(isA<Exception>()),
        );
      });
    });

    group('calculatePreviousDate', () {
      test('should calculate previous monthly date correctly', () async {
        // Arrange
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 15),
          intervalType: DateIntervalType.monthly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 3, 20);

        // Act
        final result = await periodService.calculatePreviousDate(asOfDate);

        // Assert
        expect(result.year, equals(2024));
        expect(result.month, equals(3)); // Should be March, not February
        expect(result.day, equals(15));
      });

      test('should return effective date for oneTime interval', () async {
        // Arrange
        final effectiveDate = DateTime(2024, 5, 15);
        final userSettings = UserSettings(
          effectiveDate: effectiveDate,
          intervalType: DateIntervalType.oneTime,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 6, 1);

        // Act
        final result = await periodService.calculatePreviousDate(asOfDate);

        // Assert
        expect(result, equals(DateTime(2024, 5, 15)));
      });

      test(
        'should return effective date when asOfDate is before or equal to effective date',
        () async {
          // Arrange
          final effectiveDate = DateTime(2024, 5, 15);
          final userSettings = UserSettings(
            effectiveDate: effectiveDate,
            intervalType: DateIntervalType.monthly,
            frequency: 1,
          );
          eventBus.fire(UserSettingsChangedEvent(userSettings));
          await Future.delayed(Duration(milliseconds: 10));

          final asOfDate = DateTime(2024, 4, 1);

          // Act
          final result = await periodService.calculatePreviousDate(asOfDate);

          // Assert
          expect(result, equals(DateTime(2024, 5, 15)));
        },
      );

      test('should throw exception when user settings not found', () async {
        // Ensure we have empty settings
        eventBus.fire(UserSettingsChangedEvent(UserSettings.empty));
        await Future.delayed(Duration(milliseconds: 10));

        // Act & Assert
        expect(
          () => periodService.calculatePreviousDate(DateTime.now()),
          throwsA(isA<Exception>()),
        );
      });
    });

    group('edge cases', () {
      test(
        'should handle month boundary correctly for monthly interval',
        () async {
          // Arrange - February to March (leap year)
          final userSettings = UserSettings(
            effectiveDate: DateTime(2024, 1, 31),
            intervalType: DateIntervalType.monthly,
            frequency: 1,
          );
          eventBus.fire(UserSettingsChangedEvent(userSettings));
          await Future.delayed(Duration(milliseconds: 10));

          final asOfDate = DateTime(2024, 3, 15);

          // Act
          final result = await periodService.calculateNextDate(asOfDate);

          // Assert - Should handle February having only 29 days in 2024
          expect(result.year, equals(2024));
          expect(result.month, equals(3));
          expect(result.day, equals(31));
        },
      );

      test(
        'should handle year boundary correctly for yearly interval',
        () async {
          // Arrange
          final userSettings = UserSettings(
            effectiveDate: DateTime(2024, 12, 31),
            intervalType: DateIntervalType.yearly,
            frequency: 1,
          );
          eventBus.fire(UserSettingsChangedEvent(userSettings));
          await Future.delayed(Duration(milliseconds: 10));

          final asOfDate = DateTime(2025, 6, 15);

          // Act
          final result = await periodService.calculateNextDate(asOfDate);

          // Assert
          expect(result.year, equals(2025));
          expect(result.month, equals(12));
          expect(result.day, equals(31));
        },
      );

      test('should handle leap year correctly', () async {
        // Arrange - February 29th in a leap year
        final userSettings = UserSettings(
          effectiveDate: DateTime(2024, 2, 29),
          intervalType: DateIntervalType.yearly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(userSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2025, 1, 15);

        // Act
        final result = await periodService.calculateNextDate(asOfDate);

        // Assert - Should return next year occurrence
        expect(result.year, equals(2025));
        expect(result.month, equals(3));
        expect(result.day, equals(1)); // The service uses simple year addition
      });
    });

    group('user settings updates', () {
      test('should update calculations when user settings change', () async {
        // Arrange - Initial settings
        final initialSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.monthly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(initialSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final asOfDate = DateTime(2024, 2, 15);
        final initialResult = await periodService.calculatePeriod(asOfDate);

        // Act - Update settings
        final updatedSettings = UserSettings(
          effectiveDate: DateTime(2024, 1, 1),
          intervalType: DateIntervalType.weekly,
          frequency: 1,
        );
        eventBus.fire(UserSettingsChangedEvent(updatedSettings));
        await Future.delayed(Duration(milliseconds: 10));

        final updatedResult = await periodService.calculatePeriod(asOfDate);

        // Assert
        expect(initialResult.start, isNot(equals(updatedResult.start)));
        expect(initialResult.end, isNot(equals(updatedResult.end)));
      });
    });
  });
}
