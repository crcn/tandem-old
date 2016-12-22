## Copied from Tandem shell commands
#!/bin/bash

if [ "$(uname)" == 'Darwin' ]; then
  OS='Mac'
elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  OS='Linux'
else
  echo "Your platform ($(uname -a)) is not supported."
  exit 1
fi

if [ "$(basename $0)" == 'tandem-beta' ]; then
  BETA_VERSION=true
else
  BETA_VERSION=
fi

export TANDEM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=true

while getopts ":wtfvh-:" opt; do
  case "$opt" in
    -)
      case "${OPTARG}" in
        wait)
          WAIT=1
          ;;
        help|version)
          REDIRECT_STDERR=1
          EXPECT_OUTPUT=1
          ;;
        foreground|test)
          EXPECT_OUTPUT=1
          ;;
      esac
      ;;
    w)
      WAIT=1
      ;;
    h|v)
      REDIRECT_STDERR=1
      EXPECT_OUTPUT=1
      ;;
    f|t)
      EXPECT_OUTPUT=1
      ;;
  esac
done

if [ $REDIRECT_STDERR ]; then
  exec 2> /dev/null
fi

if [ $EXPECT_OUTPUT ]; then
  export ELECTRON_ENABLE_LOGGING=1
fi

if [ $OS == 'Mac' ]; then
  
  TANDEM_APP_NAME="Tandem.app"
  TANDEM_EXECUTABLE_NAME="Electron"

  if [ -z "${TANDEM_PATH}" ]; then
    # If TANDEM_PATH isnt set, check /Applications and then ~/Applications for Tandem.app
    if [ -x "/Applications/$TANDEM_APP_NAME" ]; then
      TANDEM_PATH="/Applications"
    elif [ -x "$HOME/Applications/$TANDEM_APP_NAME" ]; then
      TANDEM_PATH="$HOME/Applications"
    else
      # We havent found an Tandem.app, use spotlight to search for Tandem
      TANDEM_PATH="$(mdfind "kMDItemCFBundleIdentifier == 'com.tandemcode'" | grep -v ShipIt | head -1 | xargs -0 dirname)"

      # Exit if Tandem can't be found
      if [ ! -x "$TANDEM_PATH/$TANDEM_APP_NAME" ]; then
        echo "Cannot locate Tandem.app, it is usually located in /Applications. Set the TANDEM_PATH environment variable to the directory containing Tandem.app."
        exit 1
      fi
    fi
  fi

  if [ $EXPECT_OUTPUT ]; then
    "$TANDEM_PATH/$TANDEM_APP_NAME/Contents/MacOS/$TANDEM_EXECUTABLE_NAME" --executed-from="$(pwd)" --pid=$$ "$@"
    exit $?
  else
    open -a "$TANDEM_PATH/$TANDEM_APP_NAME" -n --args -- --pid=$$ --executed-from="$(pwd)" --path-environment="$PATH" "$@"
  fi
elif [ $OS == 'Linux' ]; then
  SCRIPT=$(readlink -f "$0")
  USR_DIRECTORY=$(readlink -f $(dirname $SCRIPT)/..)

  TANDEM_PATH="$USR_DIRECTORY/share/tandem/tandem"

  TANDEM_HOME="${TANDEM_HOME:-$HOME/.tandem}"
  mkdir -p "$TANDEM_HOME"

  : ${TMPDIR:=/tmp}

  [ -x "$TANDEM_PATH" ] || TANDEM_PATH="$TMPDIR/tandem-build/Tandem/tandem"

  if [ $EXPECT_OUTPUT ]; then
    "$TANDEM_PATH" --executed-from="$(pwd)" --pid=$$ "$@"
    exit $?
  else
    (
    nohup "$TANDEM_PATH" --executed-from="$(pwd)" --pid=$$ "$@" > "$TANDEM_HOME/nohup.out" 2>&1
    if [ $? -ne 0 ]; then
      cat "$TANDEM_HOME/nohup.out"
      exit $?
    fi
    ) &
  fi
fi

# Exits this process when Tandem is used as $EDITOR
on_die() {
  exit 0
}
trap 'on_die' SIGQUIT SIGTERM

# If the wait flag is set, don't exit this process until Tandem tells it to.
if [ $WAIT ]; then
  while true; do
    sleep 1
  done
fi
