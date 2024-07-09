#!/usr/bin/env bash
# shellcheck disable=SC2046

# A bash shell hook for loading dotenvx encryption keys into interactive
# shell similarly to direnv. Also ships dotenv-keys function to manually
# load and unload decryption keys.
# SPDX-License-Identifier: MPL-2.0

# handle .env.keys detection
_load_env_keys() {
  if [[ "$LAST_DOTENV_DIR" == "$PWD" ]]; then
    return
  elif [[ "$LAST_DOTENV_DIR" != "$PWD" ]] && [ -f "$LAST_DOTENV_DIR/.env.keys" ]; then
    return
  fi

  if [ -f "$PWD/.env.keys" ] && [[ "$LOADED_DOTENV_KEYS" != "1" ]]; then
    echo "dotenv-keys: loading up dotenv keys from this directory"

    # TODO: Add source link since it is obviously copied from Stack Overflow.
    unamestr=$(uname)
    if [ "$unamestr" = 'Linux' ]; then
      export $(grep -v '^#' .env.keys | xargs -d '\n')
    elif [ "$unamestr" = 'FreeBSD' ] || [ "$unamestr" = 'Darwin' ]; then
      export $(grep -v '^#' .env.keys | xargs -0)
    fi

    export DOTENV_KEYS_LOADED=1 LAST_DOTENV_DIR=$PWD DOTENV_KEYS_LOADER=auto
  elif [ ! -f "$PWD/.env.keys" ] && [[ "$LOADED_DOTENV_KEYS" == "1" ]]; then
    echo "dotenv-keys: unloading dotenv keys"
    unset "${!DOTENV_PRIVATE_KEYS*}" DOTENV_KEYS_LOADED DOTENV_KEYS_LOADER
    export LAST_DOTENV_DIR=$PWD
  fi
}

if [[ ";${PROMPT_COMMAND[*]:-};" != *";_load_env_keys;"* ]]; then
    if [[ "$(declare -p PROMPT_COMMAND 2>&1)" == "declare -a"* ]]; then
        PROMPT_COMMAND=(_load_env_keys "${PROMPT_COMMAND[@]}")
    else
        PROMPT_COMMAND="_load_env_keys${PROMPT_COMMAND:+;$PROMPT_COMMAND}"
    fi
fi

# CLI logic for dotenv-keys function
# There's a possibility that I may merge code to simplify things, but
# that would be future self problem soon.
dotenv-keys() {
    if [[ $1 == "load" ]]; then
        if [ ! -f "$PWD/.env.keys" ]; then
          echo "error: missing dotenv encryption keys"
          return 1
        fi

        echo "dotenv-keys: loading up dotenv keys from this directory"
        # TODO: Add source link since it is obviously copied from Stack Overflow.
        unamestr=$(uname)
        if [ "$unamestr" = 'Linux' ]; then
          export $(grep -v '^#' .env.keys | xargs -d '\n')
        elif [ "$unamestr" = 'FreeBSD' ] || [ "$unamestr" = 'Darwin' ]; then
          export $(grep -v '^#' .env.keys | xargs -0)
        fi

        export LOADED_DOTENV_KEYS=$PWD DOTENV_KEYS_LOADER=manual DOTENV_KEYS_LOADED=1
    elif [[ $1 == "unload" ]]; then
      echo "dotenv-keys: manually unloading dotenv keys"
      unset "${!DOTENV_PRIVATE_KEY*}" DOTENV_KEYS_LOADED DOTENV_KEYS_LOADER DOTENV_KEYS_LOADED
    else
      echo "dotenv-keys - .env.keys manager for dotenvx"
      echo ""
      echo "Commands:"
      echo "  load - load keys from .env.keys in current directory into shell session"
      echo "  unload - unload keys from shell session"
    fi
}