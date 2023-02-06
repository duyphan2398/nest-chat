import { FileValidator } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export type MaxFileSizeValidatorOptions = {
  maxSize: number;
};

export class MaxFileSizeValidator extends FileValidator<MaxFileSizeValidatorOptions> {
  buildErrorMessage() {
    const i18n = I18nContext.current();
    return i18n.t('validation.MaxFileSize', {
      args: {
        size: this.validationOptions.maxSize,
      },
    });
  }

  isValid(file): boolean {
    if (!this.validationOptions) {
      return true;
    }
    return file.size < this.validationOptions.maxSize;
  }
}
