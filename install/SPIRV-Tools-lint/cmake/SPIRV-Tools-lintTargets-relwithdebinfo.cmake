#----------------------------------------------------------------
# Generated CMake target import file for configuration "RelWithDebInfo".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "SPIRV-Tools-lint" for configuration "RelWithDebInfo"
set_property(TARGET SPIRV-Tools-lint APPEND PROPERTY IMPORTED_CONFIGURATIONS RELWITHDEBINFO)
set_target_properties(SPIRV-Tools-lint PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELWITHDEBINFO "CXX"
  IMPORTED_LOCATION_RELWITHDEBINFO "${_IMPORT_PREFIX}/lib/SPIRV-Tools-lint.lib"
  )

list(APPEND _IMPORT_CHECK_TARGETS SPIRV-Tools-lint )
list(APPEND _IMPORT_CHECK_FILES_FOR_SPIRV-Tools-lint "${_IMPORT_PREFIX}/lib/SPIRV-Tools-lint.lib" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
