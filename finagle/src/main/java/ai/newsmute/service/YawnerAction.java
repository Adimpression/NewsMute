package ai.newsmute.service;

public enum YawnerAction {
    READ,
    DELETE,
    /**
     * Read most popular entry from a given source
     */
    READ_ONE,

    /**
     * Error is used to specify all invalid states. This helps in switch statements
     * <code><pre>
     * switch (to != null ? to: YawnerAction.ERROR) {
     *   case READ:
     *          break;
     *   case DELETE:
     *          break;
     *   default:;
     * }
     * </pre>
     * </code>
     */
    ERROR;

    public static YawnerAction to(final String enumAsString) {
        try {
            return YawnerAction.valueOf(enumAsString);
        } catch (final Throwable e) {
            return YawnerAction.ERROR;
        }
    }

}
