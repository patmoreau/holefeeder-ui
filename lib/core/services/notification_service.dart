abstract class NotificationService {
  Future<void> showNotification(String message, {bool isError = false});
  Future<void> showSuccess(String message) => showNotification(message);
  Future<void> showError(String message) => showNotification(message, isError: true);
}
