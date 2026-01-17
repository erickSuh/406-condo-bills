# 🏗️ Estrutura do Projeto - 2025

## Visão Geral

Este projeto segue a arquitetura **Feature-Based** moderna, recomendada para aplicações React Native escaláveis em 2025.

```
src/
├── app/                      # Configuração central
├── features/                 # Módulos de negócio (feature-based)
│   ├── auth/                 # Feature: Autenticação
│   │   ├── screens/         # Telas específicas (WelcomeScreen, LoginScreen, etc)
│   │   ├── components/      # Componentes internos (formulários, modais)
│   │   ├── services/        # Lógica de negócio (Auth0, JWT)
│   │   ├── store/           # Redux slices específicos
│   │   ├── hooks/           # Hooks customizados
│   │   ├── types.ts         # Tipos TypeScript
│   │   └── index.ts         # Exports públicos
│   ├── lists/               # Feature: Listas de compras
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── store/
│   └── items/               # Feature: Itens
│       ├── screens/
│       ├── components/
│       ├── services/
│       └── store/
├── shared/                  # Código compartilhado (sem domínio específico)
│   ├── components/          # Button, Input, Header (componentes genéricos)
│   ├── hooks/               # useAuth, useNotification, etc
│   ├── utils/               # Funções utilitárias
│   ├── types/               # Tipos compartilhados
│   └── constants/           # Constantes globais
├── infrastructure/          # Camada de dados
│   ├── api/                 # Configuração axios
│   ├── storage/             # AsyncStorage
│   └── config/              # Configurações
├── navigation/              # Rotas e navegação
│   ├── RootNavigator.tsx
│   └── types.ts
├── styles/                  # Tema global
│   ├── colors.ts
│   ├── fonts.ts
│   └── spacing.ts
└── assets/                  # Imagens, ícones
```

## Princípios

### ✅ Feature-Based
- Cada feature é um módulo autossuficiente
- Componentes vivem perto de seus serviços
- Facilita manutenção e escalabilidade

### ✅ Colocação
- Components, services, types ficam juntos
- Reduz imports circulares
- Melhor organização mental

### ✅ Single Responsibility
- Cada arquivo tem uma responsabilidade
- Funções puras e testáveis
- Hooks customizados para lógica

### ✅ Type Safety
- TypeScript strict mode
- Tipos bem definidos por feature
- Interfaces claras

## Como Usar

### Adicionar Nova Feature

```bash
mkdir -p src/features/nova-feature/{screens,components,services,store}
touch src/features/nova-feature/types.ts
touch src/features/nova-feature/index.ts
```

### Imports Recomendados

❌ **Errado:**
```typescript
import { Button } from '../../../components/Button'
import { loginWithAuth0 } from '../../../services/auth0'
```

✅ **Correto:**
```typescript
import { Button } from '@/shared/components'
import { loginWithAuth0 } from '@/features/auth/services'
```

### Estrutura de uma Feature

**src/features/auth/index.ts:**
```typescript
export { WelcomeScreen, UserIdentificationScreen } from './screens';
export { loginWithAuth0, logoutAuth0 } from './services';
export type { AuthCredentials, AuthState } from './types';
```

## Benefícios

✨ **Manutenibilidade:** Fácil encontrar código relacionado
🚀 **Escalabilidade:** Novas features sem impacto no código existente
🧪 **Testabilidade:** Componentes isolados e testáveis
📦 **Reusabilidade:** Shared components reutilizáveis
🔧 **Flexibilidade:** Estrutura preparada para crescimento

## Próximas Etapas

1. Migrar `pages/` para `features/*/screens/`
2. Migrar `components/` genéricos para `shared/components/`
3. Criar arquivo de configuração central (`src/config/`)
4. Implementar path aliases no `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```
5. Considerar Context API ou Zustand para state management global

## Referências

- [React Native Architecture Best Practices](https://reactnative.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Based Folder Structure](https://www.patterns.dev/posts/folder-structure/)
