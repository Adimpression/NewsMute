package ai.newsmute.service;

public enum GuardianAction {
    CREATE,
    READ,

    /**
     * Error is used to specify all invalid states. This helps in switch statements
     * <code><pre>
     * switch (to != null ? to: GuardianAction.ERROR) {
     *   case CREATE:
     *          break;
     *   default:;
     * }
     * </pre>
     * </code>
     */
    ERROR;

    public static GuardianAction to(final String enumAsString) {
        try {
            return GuardianAction.valueOf(enumAsString);
        } catch (final Throwable e) {
            return GuardianAction.ERROR;

        }
    }
}
