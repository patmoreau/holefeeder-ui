import 'package:flutter_test/flutter_test.dart';
import 'package:holefeeder/core/constants.dart';
import 'package:holefeeder/core/services/hive_service.dart';
import 'package:holefeeder/core/services/pending_actions_service.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'pending_actions_service_test.mocks.dart';

// Generate mocks for HiveService
@GenerateMocks([HiveService])
void main() {
  group('PendingActionsServiceImpl', () {
    late PendingActionsServiceImpl pendingActionsService;
    late MockHiveService mockHiveService;

    setUp(() {
      mockHiveService = MockHiveService();
      pendingActionsService = PendingActionsServiceImpl(
        hiveService: mockHiveService,
      );
    });

    group('setPendingAction', () {
      test('should call hive service to save the action', () async {
        // Arrange
        const action = 'test_action';
        when(
          mockHiveService.save<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
            action,
          ),
        ).thenAnswer((_) async {});

        // Act
        await pendingActionsService.setPendingAction(action);

        // Assert
        verify(
          mockHiveService.save<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
            action,
          ),
        ).called(1);
      });

      test('should handle empty action string', () async {
        // Arrange
        const action = '';
        when(
          mockHiveService.save<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
            action,
          ),
        ).thenAnswer((_) async {});

        // Act
        await pendingActionsService.setPendingAction(action);

        // Assert
        verify(
          mockHiveService.save<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
            action,
          ),
        ).called(1);
      });
    });

    group('getPendingAction', () {
      test('should return the pending action from hive service', () async {
        // Arrange
        const expectedAction = 'test_action';
        when(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).thenAnswer((_) async => expectedAction);

        // Act
        final result = await pendingActionsService.getPendingAction();

        // Assert
        expect(result, equals(expectedAction));
        verify(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).called(1);
      });

      test('should return null when no pending action exists', () async {
        // Arrange
        when(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).thenAnswer((_) async => null);

        // Act
        final result = await pendingActionsService.getPendingAction();

        // Assert
        expect(result, isNull);
        verify(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).called(1);
      });
    });

    group('clearPendingAction', () {
      test('should call hive service to clear all pending actions', () async {
        // Arrange
        when(
          mockHiveService.clearall(HiveConstants.kPendingActionsBoxName),
        ).thenAnswer((_) async {});

        // Act
        await pendingActionsService.clearPendingAction();

        // Assert
        verify(
          mockHiveService.clearall(HiveConstants.kPendingActionsBoxName),
        ).called(1);
      });
    });

    group('hasPendingAction', () {
      test(
        'should return true when pending action exists and is not empty',
        () async {
          // Arrange
          const action = 'test_action';
          when(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).thenAnswer((_) async => action);

          // Act
          final result = await pendingActionsService.hasPendingAction();

          // Assert
          expect(result, isTrue);
          verify(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).called(1);
        },
      );

      test('should return false when pending action is null', () async {
        // Arrange
        when(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).thenAnswer((_) async => null);

        // Act
        final result = await pendingActionsService.hasPendingAction();

        // Assert
        expect(result, isFalse);
        verify(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).called(1);
      });

      test('should return false when pending action is empty string', () async {
        // Arrange
        const action = '';
        when(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).thenAnswer((_) async => action);

        // Act
        final result = await pendingActionsService.hasPendingAction();

        // Assert
        expect(result, isFalse);
        verify(
          mockHiveService.get<String>(
            HiveConstants.kPendingActionsBoxName,
            HiveConstants.kPendingActionKey,
          ),
        ).called(1);
      });

      test(
        'should return false when pending action is whitespace only',
        () async {
          // Arrange
          const action = '   ';
          when(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).thenAnswer((_) async => action);

          // Act
          final result = await pendingActionsService.hasPendingAction();

          // Assert
          expect(result, isFalse);
          verify(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).called(1);
        },
      );
    });

    group('error handling', () {
      test(
        'should propagate exception from hive service on setPendingAction',
        () async {
          // Arrange
          const action = 'test_action';
          when(
            mockHiveService.save<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
              action,
            ),
          ).thenThrow(Exception('Hive error'));

          // Act & Assert
          expect(
            () => pendingActionsService.setPendingAction(action),
            throwsA(isA<Exception>()),
          );
        },
      );

      test(
        'should propagate exception from hive service on getPendingAction',
        () async {
          // Arrange
          when(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).thenThrow(Exception('Hive error'));

          // Act & Assert
          expect(
            () => pendingActionsService.getPendingAction(),
            throwsA(isA<Exception>()),
          );
        },
      );

      test(
        'should propagate exception from hive service on clearPendingAction',
        () async {
          // Arrange
          when(
            mockHiveService.clearall(HiveConstants.kPendingActionsBoxName),
          ).thenThrow(Exception('Hive error'));

          // Act & Assert
          expect(
            () => pendingActionsService.clearPendingAction(),
            throwsA(isA<Exception>()),
          );
        },
      );

      test(
        'should propagate exception from hive service on hasPendingAction',
        () async {
          // Arrange
          when(
            mockHiveService.get<String>(
              HiveConstants.kPendingActionsBoxName,
              HiveConstants.kPendingActionKey,
            ),
          ).thenThrow(Exception('Hive error'));

          // Act & Assert
          expect(
            () => pendingActionsService.hasPendingAction(),
            throwsA(isA<Exception>()),
          );
        },
      );
    });
  });
}
